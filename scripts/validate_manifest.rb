#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"
require "yaml"

repo_root = Pathname(__dir__).parent.realpath
manifest_path = Pathname(ARGV.fetch(0, "manifest/workstation-state.yaml")).expand_path(repo_root)
errors = []

unless manifest_path.file?
  warn "Manifest not found: #{manifest_path}"
  exit 1
end

begin
  manifest = YAML.safe_load(manifest_path.read, aliases: false)
rescue Psych::Exception => e
  warn "Invalid YAML in #{manifest_path.relative_path_from(repo_root)}: #{e.message}"
  exit 1
end

unless manifest.is_a?(Hash)
  warn "Manifest root must be a mapping"
  exit 1
end

declared_adapters = manifest.fetch("adapters", {})
unless declared_adapters.is_a?(Hash)
  errors << "Top-level 'adapters' must be a mapping"
  declared_adapters = {}
end

referenced_adapters = []
visit = lambda do |value|
  case value
  when Hash
    value.each do |key, child|
      referenced_adapters << child if key == "adapter" && child.is_a?(String)
      visit.call(child)
    end
  when Array
    value.each { |child| visit.call(child) }
  end
end
visit.call(manifest.reject { |key, _| key == "adapters" })

missing_adapters = referenced_adapters.uniq - declared_adapters.keys
missing_adapters.sort.each do |adapter|
  errors << "Referenced adapter '#{adapter}' is not declared under top-level 'adapters'"
end

contract_reference = manifest.dig("metadata", "contract")
if !contract_reference.is_a?(String) || contract_reference.empty?
  errors << "metadata.contract must be a non-empty local path"
else
  contract_path = manifest_path.dirname.join(contract_reference).cleanpath
  relative_contract = contract_path.relative_path_from(repo_root).to_s
  if relative_contract == ".." || relative_contract.start_with?("../")
    errors << "metadata.contract must resolve inside the repository"
  elsif !contract_path.file?
    errors << "metadata.contract does not exist: #{relative_contract}"
  end
end

if errors.any?
  errors.each { |error| warn "ERROR: #{error}" }
  exit 1
end

puts "Validated #{manifest_path.relative_path_from(repo_root)}"
puts "#{declared_adapters.length} adapters declared; #{referenced_adapters.uniq.length} referenced"
